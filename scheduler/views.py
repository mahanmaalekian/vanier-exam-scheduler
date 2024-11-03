import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

 # Create your views here.


def index(request):
     #print("in index")
     if "exams" not in request.session:
          request.session["exams"] = []

     return render(request, "scheduler/index.html")

def search(request):
     if "exams" not in request.session:
          request.session["exams"] = []
     queried = False
     query = request.POST.get('q')
     exams = []
     session_exam_ids = []
     if query:
          queried=True
          query = query.upper()
          exams = Exam.objects.filter(Q(course_id__icontains=query) | Q(description__icontains=query))
          session_exam_ids = [int(exam_dict["id"]) for exam_dict in request.session.get("exams", [])]
          #exam_list = list(exams.values())
          #print(session_exam_ids)
          #make a list of all exams that are in the session:
          #in template if exam,ccourse and exam.section and time is in the list or maybe check id
          #then button is disabled
          #else button is ebabled

          #print(exam_list)
    #print(exams)
     return render(request, "scheduler/search.html", {
          "exams": exams,
          "queried": queried,
          "session": session_exam_ids
     })

def calendar(request):
     if "exams" not in request.session:
          request.session["exams"] = []

     return render(request, "scheduler/calendar.html", {
          "exams": request.session["exams"],
     })

def contact(request):
     if "exams" not in request.session:
          request.session["exams"] = []

     return render(request, "scheduler/contact.html")

# def get_calendar(request):
#      if request.method != "GET":
#           return JsonResponse({"error:": "PUT request required"}, status=400)
#      return JsonResponse(request.session["exams"], safe=False)
     

def add_to_calendar(request):
     #print("hi")

     if request.method != "PUT":
          return JsonResponse({"error:": "PUT request required"}, status=400)
     data = json.loads(request.body)
     id = data.get("id", "")
     try:
          exam = Exam.objects.get(id=id)
     except Exam.DoesNotExist:
          return JsonResponse({"error": "Exam not found."}, status=404)
     #print(request.session["exams"])
     

     exam_dict = exam.to_dict()
     if any(existing_exam['id'] == exam_dict['id'] for existing_exam in request.session["exams"]):
        return JsonResponse({"error": f"Exam already added to calendar."}, status=409)


     request.session["exams"] += [exam_dict]
     #print("list", request.session["exams"])
     return JsonResponse({"message": "Calendar updated succesfully"}, status=200)



def remove_from_calendar(request):
     #print("in remove")
     if request.method != "DELETE":
          return JsonResponse({"error:": "DELETE request required"}, status=400)
     data = json.loads(request.body)
     id = data.get("id", "")

     if "exams" not in request.session:
        return JsonResponse({"error": "No exams found in session."}, status=400) 
     exams = request.session["exams"]

     # Find the exam and remove it
     updated_exams = [exam for exam in exams if not (exam['id'] == id )]
     if len(updated_exams) == len(exams):
        # If no exam was removed, return an error
        return JsonResponse({"error": "Exam not found."}, status=404)
     
     request.session["exams"] = updated_exams
     request.session.modified = True  # Mark the session as modified to ensure Django saves it

     return JsonResponse({"message": "Exam removed successfully."}, status=200)

#https://dylanbeattie.net/2021/01/12/adding-events-to-google-calendar-via-a-link.html