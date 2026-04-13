from django.contrib import admin
from .models import Container, Item
from .forms import ItemForm


class TabularItemInline(admin.TabularInline):
    form = ItemForm
    model = Item
    extra = 1
    fields = ("name", "index")


@admin.register(Container)
class ContainerAdmin(admin.ModelAdmin):
    list_display = ("name",)
    inlines = (TabularItemInline,)


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_editable = ("index",)
    list_display = ("name", "index")

    def get_changelist_form(self, request, **kwargs):
        kwargs.setdefault('form', ItemForm)
        return super().get_changelist_form(request, **kwargs)