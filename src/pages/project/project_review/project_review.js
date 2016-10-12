
module.exports = {
    init: function(){
        //alert('page3 init')

        $('.project_detail_content li a').removeClass('active');
        $('.project_detail_content li a.review').addClass('active');
         $('.project_detail_head h2').text($('body').attr('pname'));
    }
}
