//. jkp.js
var janken = [ 'gu', 'choki', 'pa' ];
var max_count = 0;
var min_count = 0;
var count = 0;
var win_count = 0;
var lose_count = 0;
var tie_count = 0;
var slicked = true;
$(function(){
  $('.myslick').slick({
    //centerMode: true,
    waitForAnimate: false,
    slidesToShow: 1,
    arrows: false
  });

  $('.myslick').on( 'beforeChange', function( e ){
    $('#cpuchoice').attr( 'src', 'imgs/mark_question.png' );
    $('#cpu-col').removeClass( 'col-win' );
    $('#cpu-col').removeClass( 'col-lose' );
    $('#cpu-col').removeClass( 'col-tie' );
    $('#my-col').removeClass( 'col-win' );
    $('#my-col').removeClass( 'col-lose' );
    $('#my-col').removeClass( 'col-tie' );
    slicked = true;
  });
  $('.mychoice').click( function( e ){
    if( slicked ){
      $('.slick-current').each( function( index, element ){
        //console.log( element );
        var my_choice_index = $(element).attr( 'data-slick-index'); //. 0, 1, or 2

        var cpu_choice_index = choice();
        var cpu_img = int2img( cpu_choice_index );
        $('#cpuchoice').attr( 'src', cpu_img );

        //. judge
        if( my_choice_index == cpu_choice_index ){
          $('#cpu-col').addClass( 'col-tie' );
          $('#my-col').addClass( 'col-tie' );

          count = 0;
          tie_count ++;
        }else if( my_choice_index == 0 && cpu_choice_index == 2 
        || my_choice_index == 1 && cpu_choice_index == 0
        || my_choice_index == 2 && cpu_choice_index == 1 ){
          $('#cpu-col').addClass( 'col-win' );
          $('#my-col').addClass( 'col-lose' );
          lose_count ++;

          if( count > 0 ){
            count = -1;
          }else{
            count --;
            if( min_count > count ){
              min_count = count;
              $('#cpu-record').html( '連敗記録: ' + ( -1 * min_count ) );
            }
          }
        }else{
          $('#cpu-col').addClass( 'col-lose' );
          $('#my-col').addClass( 'col-win' );
          win_count ++;
  
          if( count > 0 ){
            count ++;
            if( max_count < count ){
              max_count = count;
              $('#my-record').html( '連勝記録: ' + max_count );
            }
          }else{
            count = 1;
          }
        }
      });

      $('#win-count').html( win_count + '勝' );
      $('#tie-count').html( tie_count + '分' );
      $('#lose-count').html( lose_count + '敗' );

      console.log( count, min_count, max_count );
      $('#my-msg').html( '' );
      if( count > 0 ){
        var msg = count + '連勝中';
        $('#my-msg').html( msg );
      }else if( count < 0 ){
        var msg = ( -1 * count ) + '連敗中';
        $('#my-msg').html( msg );
      }
      slicked = false;
    }
  });
});

function int2img( n ){
  var img = './imgs/janken_' + janken[n] + '.png';
  return img;
}

function choice(){
  return random_integer(3);
}

function random_integer( m ){  //. m == 3
  var c = Math.floor( Math.random() * m );
  return c;
}

function generateUUID(){
  //. Cookie の値を調べて、有効ならその値で、空だった場合は生成する
  var did = null;
  cookies = document.cookie.split(";");
  for( var i = 0; i < cookies.length; i ++ ){
    var str = cookies[i].split("=");
    var une = unescape( str[0] );
    if( une == " deviceid" || une == "deviceid" ){
      did = unescape( unescape( str[1] ) );
    }
  }

  if( did == null ){
    var s = 1000;
    did = ( new Date().getTime().toString(16) ) + Math.floor( s * Math.random() ).toString(16);
  }

  var expires = getExpires();
  var value = ( "deviceid=" + did + '; expires=' + expires + '; path=/' );

//  if( isMobileSafari() ){
//  }else{
  document.cookie = ( value );
//  }

  return did;
}

function getRecord(){
  var record = 0;
  cookies = document.cookie.split(";");
  for( var i = 0; i < cookies.length; i ++ ){
    var str = cookies[i].split("=");
    var une = unescape( str[0] );
    if( une == " record" || une == "record" ){
      record = parseInt( unescape( unescape( str[1] ) ) );
    }
  }

  return record;
}

function setRecord( record ){
  if( record > 0 ){
    var expires = getExpires();
    var value = ( "record=" + record + '; expires=' + expires + '; path=/' );

//    if( isMobileSafari() ){
//    }else{
    document.cookie = ( value );
//    }
  }
}

function getExpires(){
  var dt = ( new Date() );
  var ts = dt.getTime();
  ts += 1000 * 60 * 60 * 24 * 365 * 100; //. 100 years
  dt.setTime( ts );

  return dt.toUTCString();
}