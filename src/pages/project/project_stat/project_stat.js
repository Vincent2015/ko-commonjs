
module.exports = {
    init: function(){
  	  $('.project_detail_content li a').removeClass('active');
      $('.project_detail_content li a.stat').addClass('active');
      $('.project_detail_head h2').text($('body').attr('pname'));
  }
}
