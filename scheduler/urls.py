from django.urls import path
from . import views

urlpatterns = [
     path("", views.index, name="index"),
     path("search/", views.search, name="search"),
     path("calendar/", views.calendar, name="calendar"),
     path("contact/", views.contact, name="contact"),

     #API Routes
     path("add_to_calendar", views.add_to_calendar, name="add_to_calendar"),
     path("remove_from_calendar", views.remove_from_calendar, name="remove_from_calendar")
 ]