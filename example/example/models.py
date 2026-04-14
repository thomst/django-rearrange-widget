from django.db import models


class Container(models.Model):
    """
    Simple container for items.
    """
    name = models.CharField('Name', max_length=255)


class Item(models.Model):
    """
    Simple item with an index for ordering.
    """
    name = models.CharField('Name', max_length=255)
    index = models.PositiveSmallIntegerField()
    container = models.ForeignKey(
        Container,
        related_name='items',
        on_delete=models.CASCADE
        )

    class Meta:
        ordering = ('container', 'index')
