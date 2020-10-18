<?php


function actionName($name) {
  $PREFIX = 'university';
  $format = '%s_%s';
  return sprintf($format, $PREFIX, $name);
}

function university_files() {
  wp_enqueue_script('main-university-js', get_theme_file_uri('/js/scripts-bundled.js'), NULL, '1.0', true);
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_stylesheet_uri());
}

function university_features() {
  add_theme_support('title-tag');
  register_nav_menu('headerMenuLocation', "Header Menu Location");
  register_nav_menu('footerLocationOne', 'Footer Location One');
  register_nav_menu('footerLocationTwo', 'Footer Location Two');
}

function university_adjust_queries($query) {
  if (!is_admin() and $query->is_main_query()) {
    if (is_post_type_archive('program')) {
      $query->set('orderby', 'title');
      $query->set('order', 'ASC');
      $query->set('posts_per_page', -1);
    } else if (is_post_type_archive('event')) {
      $today = date('Ymd');
      $query->set('meta_key', 'event_date');
      $query->set('orderby', 'meta_value_num');
      $query->set('order', 'ASC');
      $query->set('meta_query', array(
        array(
          'key' => 'event_date',
          'compare' => '>=',
          'value' => $today,
          'type' => 'numeric' 
        )
      ));
    }
  }

}

add_action('wp_enqueue_scripts', actionName('files'));
add_action('after_setup_theme', actionName('features'));
add_action('pre_get_posts', actionName('adjust_queries'));