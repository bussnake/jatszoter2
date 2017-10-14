from django.shortcuts import render
from django.http import HttpRequest
from django.template import RequestContext
from datetime import datetime
from django.template import loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Product

def show_shop(request):
    if request.method == 'GET':
        return render(request, 'a.html')

def shop(request):
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'shop.html',
        {
            'products': Product.objects.order_by('-pub_date')[:3]
        }
    )

def lazy_load_posts(request):
  page = request.POST.get('page')
  products = Product.objects.order_by('-pub_date')[:9] # 

  # use Django's pagination
  # https://docs.djangoproject.com/en/dev/topics/pagination/
  results_per_page = 3 
  paginator = Paginator(products, results_per_page)
  try:
    products = paginator.page(page)
  except PageNotAnInteger:
    products = paginator.page(2)
  except EmptyPage:
    products = paginator.page(paginator.num_pages)

  # build a html posts list with the paginated posts
  products_html = loader.render_to_string(
    'products.html',
    {'products': products}
  )

  # package output data and return it as a JSON object
  output_data = {
    'products_html': products_html,
    'has_next': products.has_next()
  }
  return JsonResponse(output_data)
