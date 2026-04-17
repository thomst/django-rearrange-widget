from django import template

register = template.Library()


@register.simple_tag(takes_context=True)
def hide_widget(context):
    classes = context['widget']['attrs']['class'].split(' ')
    if not 'hidden' in classes:
        classes.append('hidden')
    context['widget']['attrs']['class'] = ' '.join(classes)
    return ''
