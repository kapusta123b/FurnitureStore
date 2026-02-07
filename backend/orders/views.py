from django.contrib import messages
from django.db import transaction
from django.forms import ValidationError
from django.shortcuts import get_object_or_404, redirect, render

from carts.models import Cart
from carts.utils import get_user_carts
from orders.forms import CreateOrderForm, PaymentForm
from orders.models import Order, OrderItem
from users.views import login

from django.contrib.auth.decorators import login_required

# Create your views here.


@login_required
def create_order(request):
    if request.method == "POST":
        form = CreateOrderForm(data=request.POST)
        if form.is_valid():
            try:
                with transaction.atomic():
                    user = request.user
                    cart_items = Cart.objects.filter(user=user)

                    if cart_items.exists():

                        order = Order.objects.create(
                            user=user,
                            phone_number=form.cleaned_data["phone_number"],
                            requires_delivery=form.cleaned_data["requires_delivery"],
                            delivery_address=form.cleaned_data["delivery_address"],
                            zip_code=form.cleaned_data["zip_code"],
                            house_number=form.cleaned_data["house_number"],
                            payment_on_get=form.cleaned_data["payment_on_get"],
                        )

                        for cart_item in cart_items:
                            product = cart_item.product
                            name = cart_item.product.name_en
                            price = cart_item.product.sell_price()
                            quantity = cart_item.quantity

                            if product.quantity < quantity:
                                raise ValidationError(
                                    f"Insufficient quantity of {name} in stock. Available: {product.quantity}"
                                )

                            OrderItem.objects.create(
                                order=order,
                                product=product,
                                name=name,
                                price=price,
                                quantity=quantity,
                            )
                        if form.cleaned_data["payment_on_get"] == "0":
                            return redirect("orders:payment", order_id=order.id)
                        else:
                            product.quantity -= quantity
                            cart_items.delete()
                            messages.success(request, "msg_order_created")
                            return redirect("users:profile")
            except ValidationError as e:
                messages.error(request, str(e))
                context = {
                    "title": "Checkout",
                    "form": form,
                    "order": True,
                }
                return render(request, 'orders/create_order.html', context)
    else:
        initial = {
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
        }

        form = CreateOrderForm(initial=initial)

    cart_items = Cart.objects.filter(user=request.user)
    total_price = cart_items.total_price()

    context = {
        "title": "Checkout",
        "form": form,
        "order": True,
        "total_price": total_price,
    }
    return render(request, "orders/create_order.html", context=context)


@login_required
def payment_check(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    
    if order.is_paid or order.payment_on_get:
        return redirect("users:profile")

    if request.method == "POST":
        form = PaymentForm(data=request.POST)
        if form.is_valid():
            with transaction.atomic():
                order.is_paid = True
                order.status = 'completed'
                order.save()
                
                
                Cart.objects.filter(user=request.user).delete()
                
                for item in order.orderitem_set.all():
                    product = item.product
                    if product:
                        product.quantity -= item.quantity
                        product.save()

            messages.success(request, "Заказ успешно оплачен!")
            return redirect("users:profile")
    else:
        form = PaymentForm()

    context = {
        "title": "Оплата заказа",
        "order": order,
        "form": form,
    }
    return render(request, "orders/payment.html", context)


@login_required
def cancel_order(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    if order.status == 'pending':
        order.status = 'cancelled'
        order.save()
        messages.success(request, "msg_order_cancelled")
    else:
        messages.error(request, "msg_order_cannot_be_cancelled")
    return redirect("users:profile")