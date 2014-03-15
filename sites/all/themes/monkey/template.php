<?php

/**
 * @file
 * This file is empty by default because the base theme chain (Alpha & Omega) provides
 * all the basic functionality. However, in case you wish to customize the output that Drupal
 * generates through Alpha & Omega this file is a good place to do so.
 * 
 * Alpha comes with a neat solution for keeping this file as clean as possible while the code
 * for your subtheme grows. Please read the README.txt in the /preprocess and /process subfolders
 * for more information on this topic.
 */
function monkey_preprocess_page(&$variables) {
    drupal_add_js(drupal_get_path('theme', 'monkey') . "/js/monkey.js");
    if ($variables['is_front']) {
        $variables['title'] = '';
        // This is optional ... it removes the default Welcome to @site-name
        hide($variables['page']['content']['content']['content']['system_main']);
        // This will remove the 'No front page content has been created yet.'
    }
    if (isset($variables['breadcrumb'])) {
        $variables['page']['content']['content']['content']['blockify_blockify-breadcrumb']['#markup'] = $variables['breadcrumb'];
    }
    //dsm($variables);
}

function monkey_preprocess_node(&$variables) {
    if ($variables['type'] == 'product') {
        if ($variables['field_product_order_type'][0]['value'] == '1') {
            hide($variables['content']['list_price']);
            hide($variables['content']['sell_price']);
            hide($variables['content']['add_to_cart']);
        } else {
            hide($variables['content']['field_product_order_type']);
        }
    }
}

/**
 * Overriding theme functions
 */
function monkey_breadcrumb($variables) {
    $breadcrumb = $variables['breadcrumb'];
    if (!empty($breadcrumb)) {
        // Provide a navigational heading to give context for breadcrumb link to
        // screen-render users. Make the heading invisible with .element-invisible
        $output = '<h2 class="element-invisible">' . t('You are here!') . '</h2>';
        $delimiter = " > ";
        $title = drupal_get_title();
        $output .= '<div class="breadcrumb">' . implode($delimiter, $breadcrumb) . $delimiter . $title . '</div>';
        return $output;
    }
}
