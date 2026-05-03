from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ExcludedIndividual, SearchLog
from .serializers import ExcludedIndividualSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_oig(request):
    last_name  = request.GET.get('lastName',  '').strip()
    first_name = request.GET.get('firstName', '').strip()
    bus_name = request.GET.get('busName', '').strip()
    npi        = request.GET.get('npi',       '').strip()

    if not last_name and not bus_name:
        return Response({'error': 'Last name or business name is required'}, status=400)      
        
    if bus_name:
        qs = ExcludedIndividual.objects.filter(busname__icontains=bus_name)
    else:
        qs = ExcludedIndividual.objects.filter(lastname__icontains=last_name)
        if first_name:
            qs = qs.filter(firstname__icontains=first_name)
        
    if npi:
        qs = qs.filter(npi=npi)

    results = qs[:50]
    SearchLog.objects.create(
        user=request.user, first_name=first_name,
        last_name=last_name, npi=npi, results_count=results.count()
    )
    return Response(ExcludedIndividualSerializer(results, many=True).data)