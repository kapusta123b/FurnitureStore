from django.db import models
from django.urls import reverse
import random


class Categories(models.Model):
    name_en = models.CharField(
        max_length=150, 
        default='',
        verbose_name='English Name'
    )
    name_ru = models.CharField(
        max_length=150, 
        default='',
        verbose_name='Russian Name'
    )
    slug = models.SlugField(
        max_length=200, 
        unique=True, 
        blank=True, 
        null=True, 
        verbose_name='URL'
    )

    class Meta:
        db_table = 'category'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name_en


class Products(models.Model):
    name_en = models.CharField(
        max_length=150, 
        default='',
        verbose_name='Engilsh Name'
    )
    name_ru = models.CharField(
        max_length=100,
        default='',
        verbose_name='Russian Name'
    )
    primary_color_en = models.CharField(
        max_length=60,
        default='',
        verbose_name='English Primary Color'
    )
    primary_color_ru = models.CharField(
        max_length=60,
        default='',
        verbose_name='Russian Primary Color'
    )
    description_en = models.TextField(
        blank=True, 
        null=True, 
        verbose_name='English Description'
    )
    description_ru = models.TextField(
        blank=True,
        null=True,
        verbose_name='Russian Description'
    )
    details_ru = models.TextField(
        blank=True,
        null=True,
        verbose_name='Russian Details'
    )
    details_en = models.TextField(
        blank=True,
        null=True,
        verbose_name='English Details'
    )
    slug = models.SlugField(
        max_length=200, 
        unique=True, 
        blank=True, 
        null=True, 
        verbose_name='URL'
    )
    price = models.DecimalField(
        default=0.00, 
        max_digits=7, 
        decimal_places=2, 
        verbose_name='Price'
    )
    bestseller = models.BooleanField(
        default=False,
        verbose_name='Bestseller'
    )
    discount = models.DecimalField(
        default=0.00, 
        max_digits=4, 
        decimal_places=2, 
        verbose_name='Discount %'
    )
    quantity = models.PositiveIntegerField(
        default=0, 
        verbose_name='Quantity'
    )
    category = models.ForeignKey(
        to=Categories, 
        on_delete=models.CASCADE, 
        verbose_name='Category'
    )
    random_order = models.FloatField(
        default=0,
        verbose_name='Random Order',
        db_index=True
    )
    class Meta:
        db_table = 'product'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ('id',)

    def __str__(self):
        return f'{self.name_en} (Qty: {self.quantity})'
    
    def save(self, *args, **kwargs):
        if not self.random_order:
            self.random_order = random.random()
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('catalog:product', kwargs={'product_slug': self.slug})

    def display_id(self):
        return f'{self.id:05}'
    
    def sell_price(self):
        if self.discount:
            return round(self.price - self.price * self.discount / 100, 2)
        return self.price
    
    

    def get_main_image(self):
        image = self.images.filter(is_main=True).first()
        return image if image else self.images.first()


class ProductImage(models.Model):

    product = models.ForeignKey(
        to=Products,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Product'
    )
    image = models.ImageField(
        upload_to='goods_images',
        verbose_name='Image'
    )
    is_main = models.BooleanField(
        default=False,
        verbose_name='Main Image'
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Order'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created'
    )

    class Meta:
        db_table = 'product_image'
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'
        ordering = ('order', 'id')

    def __str__(self):
        return f'{self.product.name_en} - Image {self.id}'
