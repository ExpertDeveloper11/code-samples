'use strict';
$(document).ready(function () {
    /**
     * @description Defining all selectors which required
     * @type {{body: (*|jQuery|HTMLElement), buttons: {strings}, ids: {strings}, classes: {strings}, ajaxUrls: {strings}}}
     */
    var selectors = {
            body: $('body'),
            buttons : {
                like            : ".like i",
                disLike         : ".dislike i",
                dontSave        : ".dont-save",
                addDescription  : ".add-description",
                saveDesc        : ".save-description",
                editDesc        : ".lightbox-desc .edit-description",
                openSource      : ".open-source",
                removePhoto     : ".lb-photo-remove",
                prevPhoto       : "#lb-prev",
                nextPhoto       : "#lb-next",
                nextPrevWrp     : ".lb-nav div",
                lightBoxClose   : "#light-box-close"
            },
            ids : {
                photoGallery    : "#photo-gallery",
                photoGalleryImg : "#photo-gallery #image",
                sendCommentInp  : "#send-comment",
                editCommentBox  : "#desc-content"
            },
            classes : {
                preloader       : ".litebox-preloader",
                userImage       : ".lt-user-image",
                userName        : ".lt-user-name",
                dateAdded       : ".date-added > small",
                descBox         : ".lightbox-desc",
                commentsBox     : ".comments-box",
                commentBox      : ".comment-box",
                loadMore        : ".comments-box .load-more",
                sendPreloader   : ".send-preloader",
                deleteComment   : "span.delete-comment",
                descForm        : ".add-desc-form",
                descBody        : ".lightbox-desc div",
                notice          : "span.notice"
            },
            ajaxUrls : {
                getImageData    : "/ajax/image-data",
                loadAll         : "/ajax/load-all-comments",
                addComment      : "/ajax/add-comment",
                deleteComment   : "/ajax/delete-comment",
                chamgePhotoDesc : "/ajax/edit-photo-desc",
                deleteAllPhotos : '/user/delete-all-photos'
            },
            attrs : {

            },
            lightbox : {
                imageBox        : ".photos-list li",
                imageBoxWrap    : ".photos-list",
                imageWrapper    : '.content-wrapper',
                likeBtn         : '.lb-photo-actions .likes.like',
                dislikeBtn      : '.lb-photo-actions .likes.dislike',
                likes           : '.likes'
            }
        },
        prevState,
        startLength;

    /**
     * @description Highlight finger
     */
    selectors.body.on('click', selectors.lightbox.likeBtn,function () {

        selectors.body.find(selectors.lightbox.dislikeBtn).find('i').addClass('fa-thumbs-o-down');

        selectors.body.find(selectors.lightbox.dislikeBtn).find('i').removeClass(' fa-thumbs-down');

        $(this).find('i').toggleClass('fa-thumbs-o-up fa-thumbs-up');

    });

    /**
     * @description Highlight finger
     */
    selectors.body.on('click', selectors.lightbox.dislikeBtn, function () {

        selectors.body.find(selectors.lightbox.likeBtn).find('i').addClass('fa-thumbs-o-up');

        selectors.body.find(selectors.lightbox.likeBtn).find('i').removeClass(' fa-thumbs-up');

        $(this).find('i').toggleClass('fa-thumbs-o-down fa-thumbs-down');

    });

    /**
     * @description Opens lightbox and puts all data for this image
     */
    selectors.body.on('click', selectors.lightbox.imageBox, function () {

        var id       = $(this).find('img').attr('id'),
            imageBox = selectors.body.find(selectors.ids.photoGalleryImg);

        getImageData (id, imageBox);

    });

    /**
     * @description Opens source image in _blank page
     */
    selectors.body.on("click", selectors.buttons.openSource, function () {

        window.open($(this).attr('src'), '_blank');

    });

    //TODO on send error show notification
    /**
     * @description Sending and Saving comment
     */
    selectors.body.on('keydown',selectors.ids.sendCommentInp, function (e) {
        var input = selectors.body.find(selectors.ids.sendCommentInp),
            $this = $(this);

        if(e.keyCode == 13 && input.val() != '' && !input.hasClass('inprocess')) {
            $this.addClass('inprocess');
            selectors.body.find(selectors.classes.sendPreloader).fadeIn(100);
            $.post(selectors.ajaxUrls.addComment, {
                comment : input.val(),
                all     : selectors.body.find(selectors.classes.loadMore).hasClass('all-shown'),
                photoID : $(this).closest(selectors.lightbox.imageWrapper).find('img').attr('id')
            }).done(function (resp) {
                var resp = JSON.parse(resp);
                selectors.body.find(selectors.classes.commentsBox).html(JSON.parse(resp.comments));
                input.val('');
                $this.removeClass('inprocess');
                selectors.body.find(selectors.classes.sendPreloader).fadeOut(100);
            }).error(function (error) {
                console.log("error");
            });
        }
    });

    /**
     * @description Loads all comments
     */
    selectors.body.on("click", selectors.classes.loadMore, function () {
        var imageBox = selectors.body.find(selectors.ids.photoGalleryImg),
            imageID  = imageBox.find('img').attr('id'),
            $this = $(this);

        selectors.body.find(selectors.classes.sendPreloader).fadeIn(100);
        $.post(selectors.ajaxUrls.loadAll, {
            id: parseInt(imageID),
            allShown : true
        }).done(function (resp) {
            var resp = JSON.parse(resp);
            selectors.body.find(selectors.classes.commentsBox).html(JSON.parse(resp.comments));
            selectors.body.find(selectors.classes.sendPreloader).fadeOut(100);
            $this.hide();
        }).error(function (error) {
            console.log("error");
        });
    });

    /**
     * @description Delete any comment if you are owner of the page Or Delete your own comment if not
     */
    selectors.body.on('click', selectors.classes.deleteComment, function () {
        var container = $(this).closest(selectors.classes.commentBox),
            id        = container.attr('id');

        selectors.body.find(selectors.classes.sendPreloader).fadeIn(100);
        if(!container.hasClass('inprocess')) {
            container.addClass('inprocess');
            $.post(selectors.ajaxUrls.deleteComment, {
                commentID: id
            }).done(function (resp) {
                container.remove();
                selectors.body.find(selectors.classes.sendPreloader).fadeOut(100);
                container.removeClass('inprocess');
            });
        }
    });

    /**
     * @description Shows description edit form
     */
    selectors.body.on('click', selectors.buttons.addDescription, function () {
        var $this = $(this);

        $this.hide();
        selectors.body.find(selectors.classes.descForm).fadeIn(300);
        prevState = selectors.body.find(selectors.ids.editCommentBox).val();
    });

    /**
     * @description Dismiss description edit form
     */
    selectors.body.on('click', selectors.buttons.dontSave, function () {
        $(this).parent().fadeOut(100);
        selectors.body.find(selectors.buttons.addDescription).show();
        selectors.body.find(selectors.ids.editCommentBox).val('');
    });

    /**
     * @description Save description action
     */
    selectors.body.on('click', selectors.buttons.saveDesc, function () {
        var textarea = selectors.body.find(selectors.ids.editCommentBox),
            text     = textarea.val();

        if(prevState !== text) {
            $(this).css({
                pointerEvents: "none"
            });
            $.post(selectors.ajaxUrls.chamgePhotoDesc, {
                desc: text,
                id: $(selectors.ids.photoGalleryImg).find('img').attr('id')
            }).done(function (resp) {
                selectors.body.find(selectors.classes.descBox).html(text);
                selectors.body.find(selectors.classes.descForm).fadeOut(300);
                prevState = '';
                $(this).css({
                    pointerEvents: "all"
                });
            })
        }
    });

    /**
     * @description Action to edit description
     */
    selectors.body.on('click', selectors.buttons.editDesc, function () {
        var descBody = selectors.body.find(selectors.classes.descBody),
            editable = descBody.prop('contentEditable', false),
            text     = descBody.text(),
            $this    = $(this);

        if(descBody.hasClass('editable')) {
            if(text.length != startLength) {
                $this.css({
                    pointerEvents: "none"
                });
                $.post(selectors.ajaxUrls.chamgePhotoDesc, {
                    desc: text,
                    id: $(selectors.ids.photoGalleryImg).find('img').attr('id')
                }).done(function (resp) {
                    startLength = text.length;
                    $this.css({
                        pointerEvents: "all"
                    });
                });
            }
            descBody.removeClass('editable');
            descBody.prop('contentEditable', false);
        } else {
            descBody.addClass('editable');
            descBody.prop('contentEditable', true);
        }
    });

    /**
     * @description Remove photo action by click on REMOVE in the lightbox
     */
    selectors.body.on('click', selectors.buttons.removePhoto, function (e) {
        var img = $(selectors.ids.photoGalleryImg).find('img'),
            data = {};

        data[img.attr('id')] = img.attr('src');
        $.post(selectors.ajaxUrls.deleteAllPhotos, {
            ids: data
        }).done(function (resp) {
            selectors.body.find(selectors.lightbox.imageBoxWrap).find('img[id='+img.attr('id')+']').parent().remove();
            $('#photo-gallery').modal('hide')
        });
    });

    /**
     * @description Getting previous photo by arrow click and loads data for this photo
     */
    selectors.body.on('click', selectors.buttons.prevPhoto, function () {
        var images = $(selectors.lightbox.imageBox),
            currentImage = images.find('[id='+$(this).closest('.photo-section').find('img').attr('id')+']'),
            prevImage = currentImage.closest('li').prev();

        if(prevImage.length) {
            getImageData (prevImage.find('img').attr('id'));
        } else {
            getImageData ($(images[images.length-1]).find('img').attr('id'));
        }
    });

    /**
     * @description Getting next photo by arrow click and loads data for this photo
     */
    selectors.body.on('click', selectors.buttons.nextPhoto, function () {
        var images = $(selectors.lightbox.imageBox),
            currentImage = images.find('[id='+$(this).closest('.photo-section').find('img').attr('id')+']'),
            nextImage = currentImage.closest('li').next();

        if(nextImage.length) {
            getImageData (nextImage.find('img').attr('id'));
        } else {
            getImageData ($(images[0]).find('img').attr('id'));
        }
    });

    /**
     * @description Get and paste all data about selected photo function
     * @param id integer
     */
    function getImageData (id) {
        var imageBox = selectors.body.find(selectors.ids.photoGalleryImg);
        selectors.body.find(selectors.buttons.nextPrevWrp).css({
            pointerEvents: "none"
        });
        selectors.body.find(selectors.classes.preloader).fadeIn(200);
        $.post(selectors.ajaxUrls.getImageData, {
            id: parseInt(id)
        }).done(function (resp) {
            var resp = JSON.parse(resp);
            imageBox.html(resp.image);
            selectors.body.find(selectors.classes.userName).html(resp.username);
            selectors.body.find(selectors.classes.dateAdded).html(resp.dateAdded);
            selectors.body.find(selectors.classes.preloader).fadeOut(500);
            selectors.body.find(selectors.classes.descBox).html(resp.desc);
            selectors.body.find(selectors.classes.commentsBox).html(JSON.parse(resp.comments));
            selectors.body.find(selectors.buttons.openSource).attr('src', document.location.origin+resp.image_src);
            if(resp.hasDesc) {
                selectors.body.find(selectors.classes.descForm).remove();
                startLength = selectors.body.find(selectors.classes.descBody).text().length;
            }
            selectors.body.find(selectors.buttons.nextPrevWrp).css({
                pointerEvents: "all"
            });
            if(resp.imageLike == 'likeActive') {
                $(selectors.lightbox.likeBtn).find('i').toggleClass('fa-thumbs-up fa-thumbs-o-up');
            };
            if(resp.imageLike == 'dislikeActive') {
                $(selectors.lightbox.dislikeBtn).find('i').toggleClass('fa-thumbs-down fa-thumbs-o-down');
            };
        });
    }

    $(selectors.body).on('click',selectors.buttons.lightBoxClose, function () {
        $('#photo-gallery').modal('hide');
    })
});