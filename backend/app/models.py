from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()

    def __str__(self):
        return f"Post: {self.title}"

def get_default_user():
    return User.objects.first().pk

class GameLog(models.Model):
    
    #overwatch
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=get_default_user)
    date = models.DateTimeField()
    map = models.CharField(max_length=100)
    result = models.CharField(max_length=50)
    role = models.CharField(max_length=50)
    eliminations = models.IntegerField()
    assists = models.IntegerField()
    deaths = models.IntegerField()
    damage = models.IntegerField()
    healing = models.IntegerField()
    mitigation = models.IntegerField()

    def __str__(self):
        return f"{self.date} - {self.map} - {self.result}"
    
class ValGameLog(models.Model):

    #valorant
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=get_default_user)
    valDate = models.DateTimeField()
    valMap = models.CharField(max_length=100)
    valResult = models.CharField(max_length=50)
    agent = models.CharField(max_length=50)
    valStart = models.CharField(max_length=50)
    kills = models.IntegerField()
    assist = models.IntegerField()
    death = models.IntegerField()
    econRating  = models.IntegerField()
    plants = models.IntegerField()
    defuses = models.IntegerField()
    combatScore = models.IntegerField()

    def __str__(self):
        return f"{self.date} - {self.map} - {self.result}"