from django import forms
from ..models import GameLog, ValGameLog

class GameLogForm(forms.ModelForm):
    class Meta:
        model = GameLog
        fields = ['date', 'map', 'result', 'role', 'eliminations', 'assists', 'deaths', 'damage', 'healing', 'mitigation']

class ValGameLogForm(forms.ModelForm):
    class Meta:
        model = ValGameLog
        fields = ['valDate', 'valMap', 'valResult', 'agent', 'valStart', 'kills', 'assist', 'death', 'econRating', 'plants', 'defuses', 'combatScore']
