from django.contrib import admin

# Register your models here.
from .models import People
from .models import Event

admin.site.register(People)
admin.site.register(Event)

