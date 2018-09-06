"use strict";

$(window).ready(function () {
    if (window.Box2D) {
        window.b2Vec2 = Box2D.Common.Math.b2Vec2;
        window.b2BodyDef = Box2D.Dynamics.b2BodyDef;
        window.b2Body = Box2D.Dynamics.b2Body;
        window.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        window.b2Fixture = Box2D.Dynamics.b2Fixture;
        window.b2World = Box2D.Dynamics.b2World;
        window.b2ContactListener = Box2D.Dynamics.b2ContactListener;
        window.b2FilterData = Box2D.Dynamics.b2FilterData;
        window.b2MassData = Box2D.Collision.Shapes.b2MassData;
        window.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        window.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
        window.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

        window.b2JointDef = Box2D.Dynamics.Joints.b2JointDef;
        window.b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
    }

    $(".start").click(function () {
        $("#instruction1").hide();
        $("#instructions").hide();
        $("#playing").show();
        $("#bg-canvas").show();
        if (window.init) window.init();
    });

    $("#playing .question").click(function (ev) {
        ev.stopPropagation();
        $("#instructions").show();
        $("#instruction2").show();
        $("#playing").hide();
        $("#bg-canvas").hide();
        if (window.game && window.game.pause) window.game.pause();
    });
    $("#instruction2 .instruct-confirm").click(function () {
        $("#instructions").hide();
        $("#instruction2").hide();
        $("#playing").show();
        $("#bg-canvas").show();
        if (window.game && window.game.continue) window.game.continue();
    });

    $(".reset").click(function () {
        if (window.game && window.game.reset) window.game.reset();
    });

    window.informFail = function () {};

    window.informSuccess = function () {};

    window.showFail = function () {
        $("#fail").show();
    };
    window.showSuccess = function () {
        $("#success").show();
    };

    window.hideFail = function () {
        $("#fail").hide();
    };

    window.hideSuccess = function () {
        $("#success").hide();
    };

    window.showReset = function () {
        $(".reset").show();
    };

    window.hideReset = function () {
        $(".reset").hide();
    };
});