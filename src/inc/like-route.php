<?php

function universityLikeRoutes() {
	register_rest_route('university/v1', 'manageLike', array(
		'methods' => 'POST',
		'callback' => 'createLike'
	));	

	register_rest_route('university/v1', 'manageLike', array(
		'methods' => 'DELETE',
		'callback' => 'deleteLike'
	));	
}

function createLike($data) {
	if (!is_user_logged_in()) {
		die('only logged in users can heart.');
	}

	$professorId = sanitize_text_field($data['professorId']);

	$likeExists = new WP_Query(array(
		'author' => get_current_user_id(),
		'post_type' => 'like',
		'meta_query' => array(
			array(
				'key' => 'liked_professor_id',
				'compare' => '=',
				'value' => $professorId
			)
		)
	));

	if ($likeExists->found_posts != 0 and get_post_type($professorId) != 'professor') {
		die('Professor is already heared.');
	}

	return wp_insert_post(array(
		'post_type' => 'like',
		'post_status' => 'publish',
		'post_title' => '',
		'meta_input' => array(
			'liked_professor_id' => $professorId
		)
	));
}

function deleteLike($data) {
	$likeId = sanitize_text_field($data['like']);

	if (get_current_user_id() == get_post_field('post_author', $likeId) and get_post_type($likeId) == 'like') {
		wp_delete_post($likeId, true);
		return 'professor hearted.';
	} else {
		die('You do not have permission to disheart this professor.');
	}

}

add_action('rest_api_init', 'universityLikeRoutes'); 