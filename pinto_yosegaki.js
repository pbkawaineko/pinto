function createYosegaki() {
    //寄せ書きスライドのURL
    var pre = SlidesApp.openByUrl("ここにURL");
    //テンプレをまとめたスライドのURL
    var templateSlide = SlidesApp.openByUrl("ここにURL");

    //寄せ書きフォームの回答結果がリアルタイムで追加されていくスプレッドシートを事前に作っておき、以下のコードでデータを取得
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("フォームの回答 1");
    var data = sheet.getDataRange().getValues();
    
    //質問・最新の回答を取得
    var questions = data[0]
    var lastData = data[data.length - 1];
    
    //列番号を変数に格納
    var columnNumOfImageURL = 5;            //画像URLがある列
    var columnNumOfDesignWithImg = 6;       //画像ありの人が選んだテンプレ番号がある列
    var columnNumOfDesignNoImg = 7;         //画像無しの人が選んだテンプレ番号がある列
    var howManyDesignWithImg = 3;           //画像ありの人向けテンプレが何種類あるか

    //画像をアップした人
    if (lastData[columnNumOfImageURL] != "") {

        var design = lastData[columnNumOfDesignWithImg];
        var template = templateSlide.getSlides()[design]; //そのデザインのスライドを取得する
        var slide = pre.appendSlide(template);
        
        for (var j = 0; j < questions.length; j++) {
            slide.replaceAllText("%%" + questions[j] + "%%", lastData[j]); //%%で囲まれた質問欄に、lastDataの回答を埋め込んでいく
        }

        var imageURL = lastData[columnNumOfImageURL].replace("open?", "uc?export=view&"); //収集した画像アドレスを、スライドに貼り付けた時見られる形に編集する
        Logger.log(imageURL); 
        try {
            slide.getImages()[1].replace(imageURL);
        } catch (e) {
            Logger.log(i + "のデータがエラーです、テンプレはこの番号：" + design);
            Logger.log(e);
        }

    //画像をアップしてない人
    } else { 
        var designNoImg = lastData[columnNumOfDesignNoImg] + howManyDesignWithImg; //templateSlideで、指定された画像無しのテンプレが頭から数えて何番目にあるか(howManyDesignWithImgを含めて数える)
        var templateNoImg = templateSlide.getSlides()[designNoImg]; //そのデザインのスライドを取得する
        var slideNoImg = pre.appendSlide(templateNoImg);

        for (var k = 0; k < questions.length; k++) { //jは質問数に応じる
            slideNoImg.replaceAllText("%%" + questions[k] + "%%", lastData[k]);
        }
    }
}