from rest_framework import serializers
from .models import ExcludedIndividual

class ExcludedIndividualSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ExcludedIndividual
        fields = '__all__'