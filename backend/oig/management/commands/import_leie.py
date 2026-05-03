import csv
from django.core.management.base import BaseCommand
from oig.models import ExcludedIndividual

class Command(BaseCommand):
    help = 'Import OIG LEIE CSV'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str)

    def handle(self, *args, **options):
        ExcludedIndividual.objects.all().delete()
        with open(options['csv_file'], encoding='utf-8') as f:
            reader = csv.DictReader(f)
            batch = []
            for row in reader:
                batch.append(ExcludedIndividual(
                    lastname=row.get('LASTNAME',''), firstname=row.get('FIRSTNAME',''),
                    midname=row.get('MIDNAME',''),   busname=row.get('BUSNAME',''),
                    specialty=row.get('SPECIALTY',''), npi=row.get('NPI',''),
                    excltype=row.get('EXCLTYPE',''), excldate=row.get('EXCLDATE',''),
                    reindate=row.get('REINDATE',''), state=row.get('STATE',''),
                ))
                if len(batch) >= 500:
                    ExcludedIndividual.objects.bulk_create(batch)
                    batch = []
            if batch:
                ExcludedIndividual.objects.bulk_create(batch)
        self.stdout.write(self.style.SUCCESS('✅ LEIE imported!'))