from django.db import models

from goods.models import Products
from users.models import User


class CartQuerySet(models.QuerySet):
    def total_price(self):
        return sum(cart.product_price() for cart in self)
    
    def total_quantity(self):
        return sum(cart.quantity for cart in self) if self else 0


class Cart(models.Model):
    user = models.ForeignKey(
        to=User, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        verbose_name='User'
    )
    product = models.ForeignKey(
        to=Products, 
        on_delete=models.CASCADE, 
        verbose_name='Product'
    )
    quantity = models.PositiveSmallIntegerField(
        default=0, 
        verbose_name='Quantity'
    )
    session_key = models.CharField(
        max_length=32, 
        null=True, 
        blank=True
    )
    created_timestamp = models.DateTimeField(
        auto_now_add=True, 
        verbose_name='Created'
    )

    class Meta:
        db_table = 'cart'
        verbose_name = 'Cart'
        verbose_name_plural = 'Carts'

    objects = CartQuerySet().as_manager()

    def product_price(self):
        return round(self.product.sell_price() * self.quantity, 2)

    def __str__(self):
        if self.user:
            return f'{self.user.username} | {self.product.name_ru} | {self.quantity}'
        return f'Anonymous | {self.product.name_ru} | {self.quantity}'