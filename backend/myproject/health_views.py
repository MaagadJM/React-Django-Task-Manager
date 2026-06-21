import json
from urllib.request import urlopen, Request
from urllib.error import URLError
from django.conf import settings
from django.core.cache import cache
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    username = getattr(settings, 'PYTHONANYWHERE_USERNAME', '')
    token = getattr(settings, 'PYTHONANYWHERE_API_TOKEN', '')

    if not username or not token:
        return Response({'status': 'ok', 'cpu_percent': 0, 'configured': False})

    cached = cache.get('pa_cpu_usage')
    if cached is not None:
        return Response(cached)

    try:
        req = Request(
            f'https://www.pythonanywhere.com/api/v0/user/{username}/cpu/',
            headers={'Authorization': f'Token {token}'}
        )
        with urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())

        limit = data.get('daily_cpu_limit_seconds', 100)
        used = data.get('daily_cpu_total_usage_seconds', 0)
        percent = round((used / limit) * 100, 1) if limit else 0

        if percent >= 100:
            status = 'down'
        elif percent >= 80:
            status = 'warning'
        else:
            status = 'ok'

        result = {
            'status': status,
            'cpu_percent': percent,
            'configured': True,
            'next_reset': data.get('next_reset_time', ''),
        }
        cache.set('pa_cpu_usage', result, 300)  # cache for 5 minutes
        return Response(result)
    except (URLError, Exception):
        return Response({'status': 'ok', 'cpu_percent': 0, 'configured': True})
