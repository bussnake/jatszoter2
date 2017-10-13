from django.db import models

# Create your models here.

class Product(models.Model):
    dress_name = models.CharField(max_length=200,default="Ruha")
    Meretek = models.CharField(max_length=200,default="Ruha")
    Anyag = models.CharField(max_length=200,default="Ruha")
    Ar = models.CharField(max_length=200,default="Ruha")

    main_image = models.FileField(upload_to='uploads/')
    alt1_image = models.FileField(upload_to='uploads/')
    alt2_image = models.FileField(upload_to='uploads/')

    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.dress_name

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)