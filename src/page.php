<?php

  get_header();

  while(have_posts()) {
    the_post();
    pageBanner();
?>

    <div class="container container--narrow page-section">

      <?php
        // get parent page by the id of the current page
        // returns zero if there is no parent page
        $parentPage = wp_get_post_parent_id(get_the_ID());
        
        if ($parentPage) { ?>
          <div class="metabox metabox--position-up metabox--with-home-link">
            <p>
              <a class="metabox__blog-home-link" href="<?php echo get_permalink($parentPage); ?>">
                <i class="fa fa-home" aria-hidden="true"></i> Back to <?php echo get_the_title($parentPage); ?>
              </a> 
              <span class="metabox__main"><?php the_title(); ?></span>
            </p>
          </div>
        <?php }
      ?>
      
      <?php
        // check if this page is a parent
        // will return a collection of pages if the current page has children
        // otherwise it returns a falsey value
        $childrenOfThisPage = get_pages(array(
          'child_of' => get_the_ID()
        ));

        if ($parentPage or $childrenOfThisPage) { ?>
          <div class="page-links">
            <h2 class="page-links__title">
              <a href="<?php echo get_permalink($parentPage); ?>"><?php echo get_the_title($parentPage); ?></a>
            </h2>
            <ul class="min-list">
              <?php
                if ($parentPage) {
                  $findChildrenOf = $parentPage;
                } else {
                  $findChildrenOf = get_the_ID();
                }

                $pagesOptions = array(
                  'title_li' => Null,
                  'child_of' => $findChildrenOf,
                  'sort_column' => 'menu_order',
                );

                // gets pages and outputs then to the screen
                wp_list_pages($pagesOptions)
              ?>
            </ul>
          </div>
      <?php } ?>

      <div class="generic-content">
        <?php the_content(); ?>
      </div>

    </div>
    
  <?php } get_footer(); ?>
