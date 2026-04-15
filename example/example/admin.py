from django.contrib import admin
from .models import Container, Item, AnotherItem
from .forms import ItemForm


class BaseItemAdmin(admin.ModelAdmin):
    list_editable = ("index",)
    list_display = ("name", "index")

    def get_changelist_form(self, request, **kwargs):
        kwargs.setdefault('form', ItemForm)
        return super().get_changelist_form(request, **kwargs)


@admin.register(Item)
class ItemAdmin(BaseItemAdmin):
    pass


@admin.register(AnotherItem)
class AnotherItemAdmin(BaseItemAdmin):
    pass


class BaseItemInline(admin.TabularInline):
    form = ItemForm
    extra = 1
    fields = ("name", "index")


class ItemInline(BaseItemInline):
    model = Item


class AnotherItemInline(BaseItemInline):
    model = AnotherItem


@admin.register(Container)
class ContainerAdmin(admin.ModelAdmin):
    list_display = ("name",)
    inlines = (ItemInline, AnotherItemInline)
