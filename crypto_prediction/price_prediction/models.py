from django.db import models
import datetime 

# Create your models here.
class User(models.Model):
    username = models.CharField(primary_key = True, max_length=20)
    first_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)
    password = models.CharField(max_length=20)
    budget = models.IntegerField(default=0)
    created_date_time = models.DateTimeField(auto_now_add=True)

class Coin(models.Model):
    name = models.CharField(max_length=30, primary_key=True)

class GeneratedPortfolio(models.Model):
    name = models.CharField(max_length = 100)
    created_date_time = models.DateTimeField(auto_now_add=True)
    associated_username = models.ForeignKey(User, on_delete = models.CASCADE)
    valid_until_date_time = models.DateTimeField(default = datetime.datetime.now() + datetime.timedelta(days=1))
    is_active = models.BooleanField(default=True)
    coins = models.ManyToManyField(Coin, through='Coin_in_Generated_Portfolio')

class UserPortfolio(models.Model):
    name = models.CharField(max_length = 100)
    created_date_time = models.DateTimeField(auto_now_add=True)
    associated_username = models.ForeignKey(User, on_delete = models.CASCADE)
    valid_until_date_time = models.DateTimeField()
    coins = models.ManyToManyField(Coin,through='Coin_in_User_Portfolio')

class Coin_in_Generated_Portfolio(models.Model):
    portfolio_id = models.ForeignKey(GeneratedPortfolio, on_delete = models.CASCADE)
    coin_id = models.ForeignKey(Coin, on_delete = models.CASCADE)
    amount_purchased = models.FloatField()
    predicted_price = models.FloatField()
    class Meta:
        unique_together = ('coin_id', 'portfolio_id')

class Coin_in_User_Portfolio(models.Model):
    portfolio_id = models.ForeignKey(UserPortfolio, on_delete = models.CASCADE)
    coin_id = models.ForeignKey(Coin, on_delete = models.CASCADE)
    amount_purchased = models.FloatField()
    price_purhased = models.FloatField()

    class Meta:
        unique_together = ('coin_id', 'portfolio_id')
