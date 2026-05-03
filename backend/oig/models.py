from django.db import models
from django.contrib.auth.models import User

class ExcludedIndividual(models.Model):
    lastname   = models.CharField(max_length=100)
    firstname  = models.CharField(max_length=100, blank=True)
    midname    = models.CharField(max_length=100, blank=True)
    busname    = models.CharField(max_length=200, blank=True)
    specialty  = models.CharField(max_length=200, blank=True)
    npi        = models.CharField(max_length=20,  blank=True)
    excltype   = models.CharField(max_length=100, blank=True)
    excldate   = models.CharField(max_length=20,  blank=True)
    reindate   = models.CharField(max_length=20,  blank=True)
    state      = models.CharField(max_length=10,  blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['lastname', 'firstname']),
            models.Index(fields=['npi']),
        ]

    def __str__(self):
        return f"{self.lastname}, {self.firstname}"

class SearchLog(models.Model):
    user          = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name    = models.CharField(max_length=100, blank=True)
    last_name     = models.CharField(max_length=100)
    npi           = models.CharField(max_length=20, blank=True)
    results_count = models.IntegerField(default=0)
    searched_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-searched_at']