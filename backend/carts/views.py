from django.http import JsonResponse
from django.template.loader import render_to_string
from django.contrib import messages

from carts.models import Cart
from carts.utils import get_user_carts
from goods.models import Products

from django.contrib.auth.decorators import login_required

@login_required
def cart_add(request):

    product_id = request.POST.get("product_id")
    product = Products.objects.get(id=product_id)

    if request.user.is_authenticated:

        carts = Cart.objects.filter(user=request.user, product=product)
        if carts.exists():
            cart = carts.first()
            if cart:
                cart.quantity += 1
                cart.save()
                messages.success(request, 'msg_product_added')

        else:
            if product.quantity > 0:
                Cart.objects.create(user=request.user, product=product, quantity=1)
                messages.success(request, 'msg_product_added')
            
            else:

                messages.error(request, 'msg_out_of_stock')
    else:

        carts = Cart.objects.filter(
            session_key=request.session.session_key, product=product)
        if carts.exists():
            cart = carts.first()
            if cart:
                cart.quantity += 1
                cart.save()
        else:
            Cart.objects.create(session_key=request.session.session_key,
                                product=product, quantity=1)


    user_cart = get_user_carts(request)
    cart_items_html = render_to_string(
        "carts/includes/included_cart.html", {"carts": user_cart}, request=request
    )

    response_data = {
        'messages': [{'text': str(m), 'tags': m.tags} for m in messages.get_messages(request)],
        'cart_items_html': cart_items_html,
    }

    return JsonResponse(response_data)


def cart_change(request):

    cart_id = request.POST.get("cart_id")
    quantity = int(request.POST.get("quantity", 1))

    if quantity < 1:
        quantity = 1

    cart = Cart.objects.get(id=cart_id)
    cart.quantity = quantity
    cart.save()

    messages.success(request, 'msg_quantity_updated')

    user_cart = get_user_carts(request)
    cart_items_html = render_to_string(
        "carts/includes/included_cart.html", {"carts": user_cart}, request=request
    )

    response_data = {
        'messages': [{'text': str(m), 'tags': m.tags} for m in messages.get_messages(request)],
        'cart_items_html': cart_items_html,
        'quantity': quantity,
    }

    return JsonResponse(response_data)


def cart_remove(request):

    cart_id = request.POST.get("cart_id")
    cart = Cart.objects.get(id=cart_id)
    quantity = cart.quantity
    cart.delete()

    messages.success(request, 'msg_product_removed')

    user_cart = get_user_carts(request)
    cart_items_html = render_to_string(
        "carts/includes/included_cart.html", {"carts": user_cart}, request=request
    )

    response_data = {
        'message': 'Product removed from cart',
        'messages': [{'text': str(m), 'tags': m.tags} for m in messages.get_messages(request)],
        'cart_items_html': cart_items_html,
        'quantity_deleted': quantity,
    }

    return JsonResponse(response_data)
