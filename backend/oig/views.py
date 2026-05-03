from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import ExcludedIndividual, SearchLog
from .serializers import ExcludedIndividualSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_oig(request):
    last_name  = request.GET.get('lastName',  '').strip()
    first_name = request.GET.get('firstName', '').strip()
    bus_name   = request.GET.get('busName',   '').strip()
    npi        = request.GET.get('npi',       '').strip()

    try:
        page      = max(1, int(request.GET.get('page', 1)))
        page_size = min(100, max(10, int(request.GET.get('pageSize', 20))))
    except ValueError:
        page, page_size = 1, 20

    # if not any([last_name, first_name, bus_name, npi]):
    #     return Response({'error': 'At least one search field is required.'}, status=400)
    if not any([last_name, bus_name, npi]):
        return Response({'error': 'Last name, business name, or NPI is required.'}, status=400)

    if npi:
        qs = ExcludedIndividual.objects.filter(npi=npi)
        
    else:
        q = Q()

        if last_name:
            q &= Q(lastname__icontains=last_name)
        if first_name:
            q &= Q(firstname__icontains=first_name)
        if bus_name:
            q &= Q(busname__icontains=bus_name)

        if last_name and not bus_name and not first_name:
            q = Q(lastname__icontains=last_name) | Q(busname__icontains=last_name)

        qs = ExcludedIndividual.objects.filter(q).distinct()
        
    # results = list(qs[:50])
    total_count = qs.count()
    total_pages = max(1, -(-total_count // page_size))
    offset      = (page - 1) * page_size
    results     = list(qs[offset : offset + page_size])

    SearchLog.objects.create(
        user=request.user,
        first_name=first_name,
        last_name=last_name,
        npi=npi,
        results_count=len(results)
    )
    return Response({
        'results':      ExcludedIndividualSerializer(results, many=True).data,
        'total_count':  total_count,
        'total_pages':  total_pages,
        'page':         page,
        'page_size':    page_size,
    })

