from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(primary_key = True, max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    password = models.CharField(max_length=20)
    budget = models.IntegerField(default=0)
    created_date_time = models.DateTimeField(auto_now_add=True)

class Coin(models.Model):
    coin_id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=30)

class GeneratedPortfolio(models.Model):
    name = models.CharField(max_length = 100)
    created_date_time = models.DateTimeField(auto_now_add=True)
    associated_username = models.ForeignKey(User, on_delete = models.CASCADE)
    valid_until_date_time = models.DateTimeField()
    is_active = models.BooleanField()
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
    price_purhased = models.FloatField()

    class Meta:
        unique_together = ('coin_id', 'portfolio_id')

class Coin_in_User_Portfolio(models.Model):
    portfolio_id = models.ForeignKey(UserPortfolio, on_delete = models.CASCADE)
    coin_id = models.ForeignKey(Coin, on_delete = models.CASCADE)
    amount_purchased = models.FloatField()
    price_purhased = models.FloatField()

    class Meta:
        unique_together = ('coin_id', 'portfolio_id')
