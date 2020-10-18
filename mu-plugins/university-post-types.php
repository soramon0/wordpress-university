<?php

$PREFIX = 'university';
$format = '%s_%s';


function university_post_types() {
  register_post_type('event', array(
    'supports' => array('title', 'editor', 'excerpt'),
    'rewrite' => array('slug' => 'events'),
    'has_archive' => true,
    'public' => true,
    'labels' => array(
			'name' => 'Events',
			'add_new_item' => 'Add New Event',
			'edit_item' => 'Edit Event',
			'all_items' => 'All Events',
			'singular_name' => 'Event'
    ),
    'menu_icon' => 'dashicons-calendar'
  ));
}

// add custom post type
add_action( 'init', sprintf($format, $PREFIX, 'post_types'));

?>