from django.db import models

class Event(models.Model):
    eventname = models.CharField(max_length=25, blank=True)
    eventdesc = models.CharField(max_length=125, blank=True)
    created = models.CharField(max_length=25, blank=True)
    currenttime = models.CharField(max_length=25, blank=True)
    recognized = models.TextField(blank=True)

    def __str__(self):
        return self.eventname

class People(models.Model):
    name = models.CharField(max_length=125, blank=True)
    age = models.IntegerField(blank=True)
    rollno = models.CharField(max_length=25, blank=True)
    phonenumber = models.CharField(max_length=25, blank=True)

    def __str__(self):
        return self.name
    
