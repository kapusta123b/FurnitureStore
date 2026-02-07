from django.core.paginator import Paginator

from django.shortcuts import render, get_list_or_404

# Create your views here.
from goods.models import Products
from goods.utils import q_search

def catalog(request, category_slug=None):
    page = request.GET.get("page", 1)
    on_sale = request.GET.get("on_sale", None)
    bestseller = request.GET.get("bestseller", None)
    order_by = request.GET.get("order_by", None)
    query = request.GET.get("q", None)
    category = request.GET.get("category", None)

    if query:
        if category:
            goods = q_search(query, category)
        else:
            goods = q_search(query)
    elif category is not None and category != "":
        goods = Products.objects.filter(category__slug=category)
    elif category_slug == "all":
        goods = Products.objects.all().order_by('random_order')
    else:
        goods = Products.objects.filter(category__slug=category_slug)

    if on_sale:
        goods = goods.filter(discount__gt=0)
    if bestseller:
        goods = goods.filter(bestseller=True)
    if order_by and order_by != "default":
        goods = goods.order_by(order_by)

    paginator = Paginator(goods, 6)
    current_page = paginator.page(int(page))

    context = {
        "goods": current_page,
        "slug_url": category_slug,
    }
    return render(request, "goods/catalog.html", context)


def product(request, product_slug=False):
    product = Products.objects.get(slug=product_slug)

    context = {
        "product": product
    }

    return render(request, "goods/product.html", context=context)
