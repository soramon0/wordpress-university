<?php

require get_theme_file_path('/inc/search-route.php');

function actionName($name) {
  $PREFIX = 'university';
  $format = '%s_%s';
  return sprintf($format, $PREFIX, $name);
}

function pageBanner($args = array()) {
  $title = $args['title'] ? $args['title'] : get_the_title();
  $subtitle = $args['subtitle'] ? $args['subtitle'] : get_field('page_banner_subtitle');
  
  if (!isset(args['photo'])) {
    $photo = get_field('page_banner_background_image');
    if ($photo) {
      $args['photo'] = $photo['sizes']['page_banner'];
    } else {
      $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
    }
  }
 
  ?>
  <div class="page-banner">
    <div class="page-banner__bg-image"
      style="background-image: url(<?php echo $args['photo']; ?>);"></div>
    <div class="page-banner__content container container--narrow">
      <h1 class="page-banner__title"><?php echo $title; ?></h1>
      <div class="page-banner__intro">
        <p><?php echo $subtitle; ?></p>
      </div>
    </div>
  </div>
  <?php
}

function university_files() {
  wp_enqueue_script('main-university-js', get_theme_file_uri('/js/scripts-bundled.js'), NULL, '1.0', true);
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_stylesheet_uri());
  wp_localize_script('main-university-js', 'universityData', array(
    'base_url' => get_site_url(),
    'nonce' => wp_create_nonce('wp_rest'),
    'rest_url' => esc_url_raw(rest_url())
  ));
}

function university_features() {
  add_theme_support('title-tag');
  register_nav_menu('headerMenuLocation', "Header Menu Location");
  register_nav_menu('footerLocationOne', 'Footer Location One');
  register_nav_menu('footerLocationTwo', 'Footer Location Two');
  add_theme_support('post-thumbnails');
  add_image_size('professor_landscape', 400, 260, true);
  add_image_size('professor_portrait', 480, 650, true);
  add_image_size('page_banner', 1500, 350, true);
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
    } else if (is_post_type_archive('campus')) {
      $query->set('posts_per_page', -1);
    }
  }
}

// WP REST API
function university_api() {
  register_rest_field('post', 'authorName', array(
    'get_callback' => function() {return get_the_author();}
  )); 

  register_rest_field('note', 'noteCount', array(
    'get_callback' => function() {return count_user_posts(get_current_user_id(), 'note');}
  )); 
}

function university_no_adminbar_for_subs() {
  $user = wp_get_current_user();

  if (count($user->roles) == 1 AND $user->roles[0] == 'subscriber') {
    show_admin_bar(false);
  }
}

function university_redirect_subs_to_frontend() {
  $user = wp_get_current_user();

  if (count($user->roles) == 1 AND $user->roles[0] == 'subscriber') {
    wp_redirect(site_url('/'));
    exit;
  }
}

function university_header_url() {
  return esc_url(site_url('/'));
}

function university_header_title() {
  return get_bloginfo('name');
}

// customize login screen
function university_login_css() {
  wp_enqueue_style('university_main_styles', get_stylesheet_uri());
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
}

function university_markNotePrivate($data, $postarr) {
  if ($data['post_type'] == 'note') {
     if (count_user_posts(get_current_user_id(), 'note') > 4 and !$postarr['ID']) {
      die('your have reached your notes limit.');
    }


    $data['post_content'] = sanitize_textarea_field($data['post_content']);
    $data['post_title'] = sanitize_text_field($data['post_title']);
  }

  if ($data['post_type'] == 'note' and $data['post_status'] != 'trash') {
    $data['post_status'] = 'private';
  }

  return $data;
}

add_filter('wp_insert_post_data', actionName('markNotePrivate'), 10, 2);
add_filter('login_headertitle', actionName('header_title'));
add_filter('login_headerurl', actionName('header_url'));
add_action('login_enqueue_scripts', actionName('login_css'));
add_action('admin_init', actionName('redirect_subs_to_frontend'));
add_action('wp_loaded', actionName('no_adminbar_for_subs'));
add_action('wp_enqueue_scripts', actionName('files'));
add_action('after_setup_theme', actionName('features'));
add_action('pre_get_posts', actionName('adjust_queries'));
add_action('rest_api_init', actionName('api'));