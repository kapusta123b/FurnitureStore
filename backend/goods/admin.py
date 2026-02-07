from django.contrib import admin

from goods.models import Categories, Products, ProductImage


# admin.site.register(Categories)
# admin.site.register(Products)


@admin.register(Categories)
class CategoriesAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name_en",)}
    list_display = ['name_ru', 'name_en']
    fields = ['name_ru', 'name_en', 'slug']


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'is_main', 'order']
    ordering = ['order']


@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name_en",)}
    list_display = ["name_en", "quantity", "price", "discount", 'bestseller']
    list_editable = [
        "discount",
        "bestseller",
    ]
    search_fields = ["name_ru", "name_en", "description_ru", "description_en"]
    list_filter = ["discount", "quantity", "category"]
    fields = [
        "name_ru",
        "name_en",
        "primary_color_en",
        "primary_color_ru",
        "description_ru",
        "description_en",
        "details_ru",
        "details_en",
        "category",
        "slug",
        ("price", "discount"),
        "quantity",
    ]
    inlines = [ProductImageInline]
