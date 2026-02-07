from django.contrib import auth, messages
from django.db.models import Prefetch
from django.shortcuts import redirect, render
from django.urls import reverse
from django.contrib.auth.decorators import login_required

from carts.models import Cart
from orders.models import Order, OrderItem
from users.forms import ProfileForm, UserLoginForm, UserRegistrationForm


def login(request):

    if request.method == "POST":
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            username = request.POST["username"]
            password = request.POST["password"]
            user = auth.authenticate(username=username, password=password)

            session_key = request.session.session_key

            if user:
                auth.login(request, user)
                messages.success(request, f"msg_login_success")

                if session_key:
                    Cart.objects.filter(session_key=session_key).update(user=user)

                redirect_page = request.POST.get('next')
                if redirect_page and redirect_page != reverse('users:logout'):
                    return redirect(redirect_page)

                return redirect('main:index')

    else:
        form = UserLoginForm()

    context = {'title': 'Login', 'form': form}
    return render(request, 'users/login.html', context)


def registration(request):

    if request.method == "POST":
        form = UserRegistrationForm(data=request.POST)
        if form.is_valid():
            form.save()

            session_key = request.session.session_key

            user = form.instance
            auth.login(request, user)

            if session_key:
                Cart.objects.filter(session_key=session_key).update(user=user)

            messages.success(request, f"msg_register_success")
            return redirect('main:index')

    else:
        form = UserRegistrationForm()

    context = {'title': 'Register', 'form': form}
    return render(request, 'users/registration.html', context)


@login_required
def profile(request):
    user = request.user
    if request.method == "POST":
        form = ProfileForm(
            data=request.POST, instance=request.user, files=request.FILES
        )
        if 'remove-avatar' in request.POST:
            request.user.image.delete()
            user.image.delete(save=False)
            user.image = None
            user.save()
            return redirect('users:profile')
        
        if form.is_valid():
            form.save()
            messages.success(request, 'msg_profile_updated')
            return redirect('users:profile')

    else:
        form = ProfileForm(instance=request.user)

    orders = (
        Order.objects.filter(user=request.user)
        .prefetch_related(
            Prefetch(
                "orderitem_set",
                queryset=OrderItem.objects.select_related("product"),
            )
        )
        .order_by("-id")
    )

    context = {'title': 'My Profile', 'form': form, 'orders': orders}
    return render(request, 'users/profile.html', context)



def users_cart(request):

    return render(request, "carts/includes/users_cart.html")


@login_required
def logout(request):

    messages.success(request, f'msg_logout_success')
    auth.logout(request)
    return redirect('main:index')
