<?php  
  get_header();
  pageBanner();
?>

<div class="container container--narrow page-section">
  <div class="metabox metabox--position-up metabox--with-home-link">
    <p>
      <a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('campus'); ?>">
        <i class="fa fa-home" aria-hidden="true"></i> All Campuses
      </a> 
      <span class="metabox__main">
        <?php the_title(); ?>
      </span>
    </p>
  </div>

  <div class="generic-content">
    <?php the_content(); ?>
  </div>

  <?php
    $programs = new WP_Query(array(
      'posts_per_page' => -1,
      'post_type' => 'program',
      'orderby' => 'title',
      'order' => 'ASC',
      'meta_query' => array(
        array(
          'key' => 'related_campus',
          'compare' => 'LIKE',
          'value' => '"' . get_the_ID() . '"',
        )
      )
    ));
    
    if ($programs->have_posts()) {
      $title = get_the_title();
      echo '<hr class="section-break">';
      echo "<h2 class='headline headline--meduim'>Programs Available At This Campus<h2>";

      echo '<ul class="min-list link-list">';
      while($programs->have_posts()) {
        $programs->the_post(); ?>
        <li>
          <a href="<?php the_permalink(); ?>"><?php the_title();?></a>
        </li>
      <?php }
      echo '</ul>';
    }
  ?>
</div>
    
<?php get_footer(); ?>