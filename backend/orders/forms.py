import re
from django import forms


class CreateOrderForm(forms.Form):
    DELIVERY_CHOICES = (
        ('1', 'Delivery to Address'),
        ('0', 'Pickup in Store'),
    )

    PAYMENT_CHOICES = (
        ('0', 'Credit/Debit Card'),
        ('1', 'Cash/Card on Delivery'),
    )

    first_name = forms.CharField(
        label='First Name',
        max_length=100,
        widget=forms.TextInput(attrs={
            'placeholder': 'Enter your first name',
            'class': 'form-control',
        })
    )

    last_name = forms.CharField(
        label='Last Name',
        max_length=100,
        widget=forms.TextInput(attrs={
            'placeholder': 'Enter your last name',
            'class': 'form-control',
        })
    )

    phone_number = forms.CharField(
        label='Phone Number',
        max_length=20,
        widget=forms.TextInput(attrs={
            'placeholder': '1234567890',
            'class': 'form-control',
        })
    )

    requires_delivery = forms.ChoiceField(
        label='Delivery Method',
        choices=DELIVERY_CHOICES,
        widget=forms.RadioSelect(),
    )

    delivery_address = forms.CharField(
        label='Delivery Address',
        required=False,
        widget=forms.Textarea(attrs={
            'placeholder': 'Street address, city, state',
            'rows': 3,
            'class': 'form-control',
        })
    )

    zip_code = forms.CharField(
        label='Zip Code',
        required=False,
        max_length=20,
        widget=forms.TextInput(attrs={
            'placeholder': '12345',
            'class': 'form-control',
        })
    )

    house_number = forms.CharField(
        label='House Number',
        required=False,
        max_length=50,
        widget=forms.TextInput(attrs={
            'placeholder': 'Apt 101, Suite A, etc.',
            'class': 'form-control',
        })
    )

    payment_on_get = forms.ChoiceField(
        label='Payment Method',
        choices=PAYMENT_CHOICES,
        widget=forms.RadioSelect(),
    )


    def clean_phone_number(self):
        data = self.cleaned_data['phone_number']

        # Remove common phone number formatting characters
        clean_data = re.sub(r'[^\d+]', '', data)

        if not clean_data:
            raise forms.ValidationError('Phone number cannot be empty')

        return clean_data

    def clean(self):
        cleaned_data = super().clean()
        requires_delivery = cleaned_data.get('requires_delivery')
        delivery_address = cleaned_data.get('delivery_address')
        zip_code = cleaned_data.get('zip_code')
        house_number = cleaned_data.get('house_number')

        if requires_delivery == '1':
            if not delivery_address:
                self.add_error('delivery_address', 'Delivery address is required')
            if not zip_code:
                self.add_error('zip_code', 'Zip code is required')
            if not house_number:
                self.add_error('house_number', 'House number is required')

        return cleaned_data


class PaymentForm(forms.Form):
    card_name = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={
            'id': 'name',
            'placeholder': 'JOHN DOE',
            'required': True
        })
    )
    card_number = forms.CharField(
        max_length=19,
        widget=forms.TextInput(attrs={
            'id': 'cardnumber',
            'placeholder': '0000 0000 0000 0000',
            'required': True,
            'pattern': '[0-9 ]*',
            'inputmode': 'numeric'
        })
    )
    expiration_date = forms.CharField(
        max_length=5,
        widget=forms.TextInput(attrs={
            'id': 'expirationdate',
            'placeholder': '01/23',
            'required': True,
            'pattern': '[0-9/]*',
            'inputmode': 'numeric'
        })
    )
    cvv = forms.CharField(
        max_length=3,
        widget=forms.TextInput(attrs={
            'id': 'securitycode',
            'placeholder': '000',
            'required': True,
            'pattern': '[0-9]*',
            'inputmode': 'numeric'
        })
    )