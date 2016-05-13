<?php

namespace app\components\LikeWidget;

use app\models\User\PhotoLikes;
use Yii,
    yii\bootstrap\Html,
    yii\jui\Widget;

/**
 * @description Class LikeWidget
 * @package app\components\LikeWidget
 */
class LikeWidget extends Widget {

    public static function actions(){

        return array(

            'Like'   => \app\components\LikeWidget\actions\Like::className(),
            'Dislike'=> \app\components\LikeWidget\actions\Dislike::className(),

        );

    }

    /**
     * @description Type of call, for now its can be photo, comment, record on wall
     * @var string
     */
    public $type;

    /**
     * @description Default Type of call if it does not setted up in the widget call
     * @default photo
     * @var string
     */
    public $defType = 'photo';

    /**
     * @description Items list, Like, disLike buttons
     * @var array
     */
    public $items = [];

    /**
     * @description Default items list
     * @default '<i class="fa fa-thumbs-o-up"></i>',
     *          '<i class="fa fa-thumbs-o-down"></i>';
     * @var array
     */
    public $defaultItems = [
        '<i class="fa fa-thumbs-o-up"></i>',
        '<i class="fa fa-thumbs-o-down"></i>'
    ];

    /**
     * @description Defining classes for buttons
     * @default 'like','disike', likes
     * @var array
     */
    private $buttonClasses = [
        'likes like',
        'likes dislike'
    ];

    public $wrapper;

    public $dataTarget = null;


    public function init () {

        parent::init();

    }

    /**
     * @return string
     */
    public function run () {

        return $this->render('index', [
                    'items' => $this->renderItems($this->items)
                ]);

    }

    /**
     * @description Renders the like dislike buttons
     * @param array $items
     * @return string the rendering result
     */
    protected function renderItems ($items) {

        $classes = $this->buttonClasses;

        $type = $this->type;

        $lines = [];

        $tag = 'li';

        if(empty($items)) {

            $items = $this->defaultItems;

        }

        if(empty($type)) {

            $type = $this->defType;

        }

        switch ($type) {

            case 'photo' :

                $model = new PhotoLikes();

            break;

        }

        foreach ($items as $id => $item) {

            $attributes = [
                'call-type' => $type,
                'class'     => $classes[$id]
            ];

            if(!empty($this->wrapper)) {

                $attributes['target-id'] = $this->wrapper;

            }

            if(empty($this->dataTarget)) {

                $active = '';

            } else {

                $active = $this->dataTarget;

            }

           if($classes[$id] == 'likes like' && $active == 'likeActive') {

                $attributes['class'] = $classes[$id]." liked";

            } elseif ($classes[$id] == 'likes dislike' && $active == 'dislikeActive') {

                $attributes['class'] = $classes[$id]." liked";

            } else {

                $attributes['class'] = $classes[$id];

            }

            $lines[] = Html::tag($tag, $item, $attributes);

        }

        sort($lines);

        return implode("\n", $lines);

    }

}