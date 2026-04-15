from django import template

register = template.Library()


@register.simple_tag(takes_context=True)
def hide_widget(context):
    context['widget']['attrs']['class'] += ' hidden'
    return ''
