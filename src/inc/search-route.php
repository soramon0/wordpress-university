<?php

function universitySearchResults($data)
{
	$query = new WP_Query(array(
		'post_type' => array(
			'post', 'page', 'professor', 'program', 'event', 'campus'
		),
		's' => sanitize_text_field($data['term']),
	));

	$res = array(
		'generalInfo' => array(),
		'professors' => array(),
		'programs' => array(),
		'events' => array(),
		'campuses' => array()
	);

	while ($query->have_posts()) {
		$query->the_post();
		$post_type = get_post_type();

		if ($post_type == 'post' or $post_type == 'page') {
			array_push($res['generalInfo'], array(
				'title' => get_the_title(),
				'permalink' => get_the_permalink(),
				'postType' => $post_type,
				'authorName' => get_the_author()
			));
		}
		if ($post_type == 'professor') {
			array_push($res['professors'], array(
				'title' => get_the_title(),
				'permalink' => get_the_permalink(),
				'image' => get_the_post_thumbnail_url(0, 'prefessorLandscape')
			));
		}
		if ($post_type == 'program') {
			$relatedCampuses = get_field('related_campus');

			if ($relatedCampuses) {
				foreach($relatedCampuses as $campus) {
					array_push($res['campuses'], array(
						'title' => get_the_title($campus),
						'permalink' => get_the_permalink($campus),
					));
				}
			}

			array_push($res['programs'], array(
				'id' => get_the_ID(),
				'title' => get_the_title(),
				'permalink' => get_the_permalink(),
			));
		}
		if ($post_type == 'event') {
			$eventDate = new DateTime(get_field('event_date'));

			$description = null;

			if (has_excerpt()) {
				$description = get_the_excerpt();
			} else {
				$description = wp_trim_words(get_the_content(), 18);
			}

			array_push($res['events'], array(
				'title' => get_the_title(),
				'permalink' => get_the_permalink(),
				'month' => $eventDate->format('M'),
				'day' => $eventDate->format('d'),
				'description' => $description,
			));
		}
		if ($post_type == 'campus') {
			array_push($res['campuses'], array(
				'title' => get_the_title(),
				'permalink' => get_the_permalink(),
			));
		}
	}

	if ($res['programs']) {
		$programsMetaQuery = array('relation' => 'OR');

		foreach ($res['programs'] as $program) {
			array_push($programsMetaQuery, array(
				'key' => 'related_programs',
				'compare' => 'LIKE',
				'value' =>  '"' . $program['id'] . '"'
			));
		}

		$relatedPrograms = new WP_Query(array(
			'post_type' => array('professor', 'event'),
			'meta_key' => $programsMetaQuery
		));

		while ($relatedPrograms->have_posts()) {
			$relatedPrograms->the_post();

			if (get_post_type() == 'event') {
				$eventDate = new DateTime(get_field('event_date'));

				$description = null;

				if (has_excerpt()) {
					$description = get_the_excerpt();
				} else {
					$description = wp_trim_words(get_the_content(), 18);
				}

				array_push($res['events'], array(
					'title' => get_the_title(),
					'permalink' => get_the_permalink(),
					'month' => $eventDate->format('M'),
					'day' => $eventDate->format('d'),
					'description' => $description,
				));
			}

			array_push($res['professors'], array(
				'title' => get_the_title(),
				'permalink' => get_the_permalink(),
				'image' => get_the_post_thumbnail_url(0, 'prefessorLandscape')
			));
		}

		$res['professors'] = array_values(array_unique($res['professors'], SORT_REGULAR));
		$res['events'] = array_values(array_unique($res['events'], SORT_REGULAR));
	}

	return $res;
}

function universityRegsiterSearch()
{
	register_rest_route('university/v1', 'search', array(
		'methods' => WP_REST_SERVER::READABLE,
		'callback' => 'universitySearchResults'
	));
}

add_action('rest_api_init', 'universityRegsiterSearch');
