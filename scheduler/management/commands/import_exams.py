import csv
from django.core.management.base import BaseCommand
from scheduler.models import Exam  # Replace 'your_app' with the actual app name

class Command(BaseCommand):
    help = 'Import exams from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file to import')

    def handle(self, *args, **kwargs):
        csv_file_path = kwargs['csv_file']
        
        with open(csv_file_path, mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                exam = Exam(
                    date=row['date'],  # Adjust these keys to match your CSV headers
                    course_id=row['course_id'],
                    section_id=row['section_id'],
                    description=row['description'],
                    teacher=row['teacher'],
                    start_time=row['start_time'],
                    end_time=row['end_time'],
                    room_number=row['room_number'],
                    row=row.get('row', None)  # Handle optional field
                )
                exam.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully added exam: {exam}'))
