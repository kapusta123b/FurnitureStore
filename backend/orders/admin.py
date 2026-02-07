import re
import stat
from django.contrib import admin

from orders.models import Order, OrderItem

# Register your models here.


class OrderItemTabulareAdmin(admin.TabularInline):
    model = OrderItem
    fields = "product", "name", "price", "quantity"
    search_fields = (
        "product",
        "name",
    )
    extra = 0


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "product",
        "name",
        "price",
        "quantity",
    )
    list_filter = (
        "order",
        "product",
        "name",
        "price",
        "quantity",
        "created_timestamp",
    )
    search_fields = (
        "order",
        "product",
        "name",
    )


class OrderTabulareAdmin(admin.TabularInline):

    model = Order

    fields = (
        "requires_delivery",
        "status",
        "created_timestamp",
        "is_paid",
        "payment_on_get",
    )

    search_fields = (
        "requires_delivery",
        "created_timestamp",
        "is_paid",
        "payment_on_get",
    )
    readonly_fields = ("created_timestamp",)
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "requires_delivery",
        "status",
        "created_timestamp",
        "payment_on_get",
        "is_paid",
    )

    search_fields = ("id",)
    readonly_fields = ("created_timestamp",)
    list_filter = (
        "requires_delivery",
        "payment_on_get",
        "is_paid",
        "status",
    )
    inlines = (OrderItemTabulareAdmin,)
