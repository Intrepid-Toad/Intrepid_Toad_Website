// post-lists.js
//   1. numbers captioned figures/tables in document order
//   2. builds "Table of Figures" / "Table of Tables" lists
//   3. resolves cross-references written with _includes/md/ref.html
//
// Targets (supplied by _includes/md/navigation.html):
//   <nav id="lof" class="post-list-nav"></nav>
//   <nav id="lot" class="post-list-nav"></nav>
//
// Figures: {% include md/figure.html name="action" %}
//          -> <figure data-name="action"><figcaption>...</figcaption></figure>
//
// Tables:  markdown table followed by a kramdown IAL:
//              {:data-caption="Veterancy multipliers" data-name="vet"}
//          data-caption is promoted to a real <caption>; data-name is
//          optional and only needed if you cross-reference the table.
//
// Refs:    {% include md/ref.html figure="action" %}
//          -> <a class="xref" data-xref-name="action" ...>Fig.</a>
//          filled in below as "Fig. 1" and linked to #figure-action.
//
// Uncaptioned figures/tables are ignored: not numbered, not listed.
// Set POST_LISTS_DEBUG = true to log what was found.

var POST_LISTS_DEBUG = false;

document.addEventListener('DOMContentLoaded', function () 
{
    // Content root: prefer a known post wrapper, else fall back to body.
    var scope = document.querySelector('#post')
        || document.querySelector('#articles')
        || document.querySelector('.post-content')
        || document.body;

    // name -> { n: 1, id: "figure-action" }
    var maps = { figure: {}, table: {} };

    function log() 
    {
        if (POST_LISTS_DEBUG) console.log.apply(console, arguments);
    }

    // Turn {:data-caption="..."} into a real <caption> element.
    function promoteDataCaptions() 
    {
        var tables = scope.querySelectorAll('table[data-caption]');
        log('post-lists: tables with data-caption =', tables.length);
        tables.forEach(function (table) {
            if (table.querySelector('caption')) return;
            var cap = document.createElement('caption');
            cap.textContent = table.getAttribute('data-caption');
            table.insertBefore(cap, table.firstChild);
        });
    }

    // Number items, record names, optionally build a list.
    function numberAndList(itemSelector, captionSelector, type, label, targetId, headingText) 
    {
        var items = Array.prototype.filter.call(scope.querySelectorAll(itemSelector), function (el) { return !el.closest('.post-nav'); });
        log('post-lists: ' + label + ' candidates =', items.length);

        var list = document.createElement('ol');
        list.className = 'post-list-nav-items';
        var counted = 0;

        items.forEach(function (el) 
        {
            var cap = el.querySelector(captionSelector);
            if (!cap) return;                    // uncaptioned: skip

            counted++;
            var name = el.getAttribute('data-name');
            var id = type + '-' + (name || counted);
            el.id = id;
            if (name) maps[type][name] = { n: counted, id: id };

            var original = cap.textContent.trim();
            cap.textContent = label + ' ' + counted + '. ' + original;

            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + id;
            a.textContent = cap.textContent;
            li.appendChild(a);
            list.appendChild(li);
        });

        log('post-lists: ' + label + ' captioned =', counted);

        var host = document.getElementById(targetId);
        if (!host) { log('post-lists: no #' + targetId + ' target'); return; }
        if (!counted) return;                    // leaves nav :empty -> hidden

        var h = document.createElement('h4');
        h.textContent = headingText;
        host.appendChild(h);
        host.appendChild(list);
    }

    // Fill in "Fig. 1" / "Table 2" and point each link at its target.
    function resolveRefs() {
        var refs = document.querySelectorAll('.xref');
        log('post-lists: xrefs =', refs.length);

        refs.forEach(function (a) {
            var type = a.getAttribute('data-xref-type');
            var name = a.getAttribute('data-xref-name');
            var label = a.getAttribute('data-xref-label') || 'Ref.';
            var entry = maps[type] && maps[type][name];

            if (!entry) {                        // typo, or target uncaptioned
                a.textContent = label + ' ?';
                a.classList.add('xref-missing');
                log('post-lists: unresolved xref ->', type, name);
                return;
            }
            a.textContent = label + ' ' + entry.n;
            a.setAttribute('href', '#' + entry.id);
        });
    }

    log('post-lists: scope =', scope.id || scope.tagName);
    promoteDataCaptions();
    numberAndList('figure', 'figcaption', 'figure', 'Figure', 'lof', 'Figures');
    numberAndList('table', 'caption', 'table', 'Table', 'lot', 'Tables');
    resolveRefs();   // must run after numbering
});
