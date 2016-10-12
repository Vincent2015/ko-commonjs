
module.exports = {
    init: function(){
        //alert('page3 init')
       $('.content_bar span.p_btn.inactive').hover(function(){
        	$(this).find('img').src = "../../../static/images/cloud_doc1.png"
        })
        $('.project_detail_content li a').removeClass('active');
        $('.project_detail_content li a.doc').addClass('active');
        $('.project_detail_head h2').text($('body').attr('pname'));
    }
}
