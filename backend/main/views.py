from django.shortcuts import render
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from goods.models import Products
def index(request):
    goods = Products.objects.filter(bestseller=True).order_by('random_order')[:8]
    photocollage = Products.objects.order_by('random_order')[:12]

    products_count = {
        "tables": Products.objects.filter(category__slug='tables').count(),
        "chairs": Products.objects.filter(category__slug='chairs').count(),
        "sofas": Products.objects.filter(category__slug='sofas').count(),
        "armchairs": Products.objects.filter(category__slug='armchairs').count(),
    }

    context = {
        'goods': goods,
        'photocollage': photocollage,
        "products": products_count,
    }
    return render(request, 'main/index.html', context)


def about(request):

    context = {
        'title': 'About Us',
        'content': 'About Our Store',
        'text_on_page': 'Learn about our mission and commitment to quality furniture',
    }
    return render(request, 'main/about.html', context)


def contact(request):

    context = {
        'title': 'Contact Us',
        'content': 'Contact Information',
        'text_on_page': 'Get in touch with our customer service team',
    }
    return render(request, 'main/contact-us.html', context)


def returns(request):

    context = {
        'title': 'Returns Policy',
        'content': 'Returns & Exchanges',
        'text_on_page': 'Learn about our hassle-free return policy',
    }
    return render(request, 'main/returns.html', context)


def account_details(request):

    context = {
        'title': 'Account Details',
        'content': 'Manage Your Account',
        'text_on_page': 'Update your personal information and preferences',
    }
    return render(request, 'main/account-details.html', context)


def faq(request):

    context = {
        'title': 'FAQ - Frequently Asked Questions',
        'content': 'Frequently Asked Questions',
        'text_on_page': 'Find answers to common questions',
    }
    return render(request, 'main/faq.html', context)


def addresses(request):

    context = {
        'title': 'Our Locations',
        'content': 'Store Locations & Warehouses',
        'text_on_page': 'Visit our showrooms and warehouses across the United States',
    }
    return render(request, 'main/addresses.html', context)
@login_required
def subscribe(request):
    if request.method == "POST" and request.user.is_authenticated:
        user = request.user
        if request.POST.get('subscribe') == '1':
            user.is_subscribe = True
            user.save()
            messages.success(request, f'msg_subscribed')
            return render(request, 'main/index.html')
        elif request.POST.get('subscribe') == '2':
            user.is_subscribe = False
            user.save()
            messages.warning(request, f'msg_unsubscribed')
            return render(request, 'main/index.html')
    else:
        return render(request, 'users/login.html')
