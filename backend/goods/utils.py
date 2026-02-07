from goods.models import Products
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

def q_search(query, category=None):
    
    if query.isdigit() and len(query) <= 5:
        
        return Products.objects.filter(id=int(query))
    
    vector = SearchVector(
        "slug",
        "name_en",
        "name_ru",
        "description_en",
        "description_ru",
        "primary_color_en",
        "primary_color_ru"
    )
    search_query = SearchQuery(query)

    result = Products.objects.annotate(rank=SearchRank(vector, search_query)).filter(rank__gt=0).order_by("-rank")
    
    if category and category != "":
        return result.filter(category__slug=category)

    return result