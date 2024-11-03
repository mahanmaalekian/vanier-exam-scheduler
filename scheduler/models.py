from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator

# Create your models here.

class Exam(models.Model):
    date = models.DateField()
    course_id = models.CharField(
        max_length=8,
        validators=[MinLengthValidator(8), MaxLengthValidator(8)]
    )
    section_id = models.CharField(max_length=64)
    description = models.CharField(max_length=64)
    teacher = models.CharField(max_length=64)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room_number = models.CharField(max_length=64)
    row=models.CharField(max_length=64, null=True, blank=True)

    def __str__(self):
        return f"{self.description}: sections {self.section_id}"
        
    def to_dict(self):
        return {
            "id": int(self.id),
            "date": str(self.date),
            "course_id": str(self.course_id),
            "section_id": str(self.section_id),
            "description": str(self.description),
            "teacher": str(self.teacher),
            "start_time": str(self.start_time),
            "end_time": str(self.end_time),
            "room_number": str(self.room_number),
            "row": str(self.row) if self.row != None else ""
        }
