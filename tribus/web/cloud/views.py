#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.shortcuts import render, get_object_or_404
from tribus.web.cloud.models import *
from tribus.config.pkgrecorder import raiz, relation_types


def frontpage(request):

    
    return render(request, 'cloud/frontpage.html', {
        'render_js': ['jquery', 'bootstrap', 'angular', 'angular.resource',
                    'packages.frontpage.app', 'packages.frontpage.jquery',
                    'navbar.app', 'navbar.jquery'],
        })


def profile(request, name):
    p = get_object_or_404(Package, Package=name)
    context["paquete"] = p
    details_list = Details.objects.filter(package = p[0])
    dict_details = {}
    for det in details_list:
        dict_details[det.Distribution] = {}
        dict_details[det.Distribution][det.Architecture] = {}
        dict_details[det.Distribution][det.Architecture]['data'] = det
        dict_details[det.Distribution][det.Architecture]['relations'] = {}
        r = Relation.objects.filter(details = det).order_by("alt_id", "related_package",
                                                            "version")
        for n in r:
            if n.relation_type in relation_types:
                if not dict_details[det.Distribution][det.Architecture]['relations'].has_key(n.relation_type):
                    dict_details[det.Distribution][det.Architecture]['relations'][n.relation_type] = []
                dict_details[det.Distribution][det.Architecture]['relations'][n.relation_type].append(n)
    context["raiz"] = raiz
    context["detalles"] = dict_details

    context['render_js'] = ['jquery', 'bootstrap']
    context['render_css'] = ['normalize', 'fonts', 'bootstrap', 'bootstrap-responsive',
                       'font-awesome', 'tribus', 'tribus-responsive']
    
    return render(request,'cloud/packages.html', context)


def by_category(request, category):
    l = Label.objects.filter(Name = category)
    context = {"categories":l}
    return render(request,'cloud/categories.html', context)


def by_tag(request, tag):
    p = Package.objects.filter(Labels__Tags__Value = tag)
    context = {"tags":p}
    return render(request,'cloud/tags.html', context)