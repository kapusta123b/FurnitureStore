from django.db import models

from goods.models import Products
from users.models import User


class OrderItemQuerySet(models.QuerySet):
    def total_price(self):
        return sum(item.products_price() for item in self)

    def total_quantity(self):
        return sum(item.quantity for item in self) if self else 0


ORDER_STATUS_CHOICES = (
    ('pending', 'Pending'),
    ('processing', 'Processing'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
)


class Order(models.Model):

    user = models.ForeignKey(
        to=User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='User'
    )
    created_timestamp = models.DateTimeField(
        auto_now_add=True, 
        verbose_name='Created'
    )
    phone_number = models.CharField(
        blank=False, 
        null=False, 
        max_length=20, 
        verbose_name='Phone Number'
    )
    requires_delivery = models.BooleanField(
        default=False, 
        verbose_name='Requires Delivery'
    )
    delivery_address = models.TextField(
        blank=True, 
        null=True, 
        verbose_name='Delivery Address'
    )
    zip_code = models.CharField(
        blank=True,
        null=True,
        max_length=20,
        verbose_name='Zip Code'
    )
    house_number = models.CharField(
        blank=True,
        null=True,
        max_length=50,
        verbose_name='House Number'
    )
    payment_on_get = models.BooleanField(
        default=False, 
        verbose_name='Payment on Delivery'
    )
    is_paid = models.BooleanField(
        default=False, 
        verbose_name='Is Paid'
    )
    status = models.CharField(
        max_length=20,
        choices=ORDER_STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )

    class Meta:
        db_table = 'order'
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    def __str__(self):
        user_name = f'{self.user.first_name} {self.user.last_name}' if self.user else 'Deleted User'
        return f'Order #{self.pk} | {user_name}'


class OrderItem(models.Model):
    order = models.ForeignKey(
        to=Order, 
        on_delete=models.CASCADE, 
        verbose_name='Order'
    )
    product = models.ForeignKey(
        to=Products,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Product'
    )
    name = models.CharField(
        max_length=150, 
        verbose_name='Name'
    )
    price = models.DecimalField(
        max_digits=7, 
        decimal_places=2, 
        verbose_name='Price'
    )
    quantity = models.PositiveIntegerField(
        default=0, 
        verbose_name='Quantity'
    )
    created_timestamp = models.DateTimeField(
        auto_now_add=True, 
        verbose_name='Created'
    )

    class Meta:
        db_table = 'order_item'
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    objects = OrderItemQuerySet.as_manager()

    def products_price(self):
        return round(self.price * self.quantity, 2)

    def __str__(self):
        return f'{self.name} | Order #{self.order.pk}'
