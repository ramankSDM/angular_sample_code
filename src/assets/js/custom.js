$('#demo').on('slide.bs.carousel', function (event) {
    var totalLength = $('.carousel-item').length;
    console.log('total slides are : '+totalLength);
    $('video').each(function() {
        $(this).get(0).pause();
        $(this).get(0).currentTime = 0
    });
    var sounds = document.getElementsByTagName('audio');
    for(i=0; i<sounds.length; i++){
        sounds[i].pause();
        sounds[i].currentTime = 0;
    }

    setTimeout(() => {
        var activeIndex = $( ".carousel-inner > .active" ).index()+1;
        console.log('active index is : '+activeIndex);
        if($('.carousel-inner > .carousel-item').eq(activeIndex-1).find('video').length > 0){
            console.log('videos');

            console.log($('.carousel-inner > .carousel-item').eq(activeIndex-1).find('video')[0].play());
        }
        if($('.carousel-inner > .carousel-item').eq(activeIndex-1).find('audio').length > 0){
            console.log('audio');
            console.log($('.carousel-inner > .carousel-item').eq(activeIndex-1).find('audio')[0].play());
        }
    }, 800);
    
});
