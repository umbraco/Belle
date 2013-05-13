describe('notifications', function () {

  var $scope, notifications;
  beforeEach(module('umb.services.notifications'));
  beforeEach(inject(function($injector) {
    $scope = $injector.get('$rootScope');
    notifications = $injector.get('notifications');
  }));

  describe('global notifications crud', function () {

    it('should allow to add, get and remove notifications', function () {
      var not1 = notifications.success("success", "something great happened");
      var not2 = notifications.error("error", "something great happened");
      var not3 = notifications.warning("warning", "something great happened");

      expect(notifications.getCurrent().length).toBe(3);

      //remove at index 0
      notifications.remove(0);

      expect(notifications.getCurrent().length).toEqual(2);
      expect(notifications.getCurrent()[0].headline).toBe("error");

      notifications.removeAll();
      expect(notifications.getCurrent().length).toEqual(0);
    });

  });

/*
  describe('notifications expiring after route change', function () {
    it('should remove notification after route change', function () {
      var sticky = notifications.pushSticky({msg:'Will stick around after route change'});
      var currentRoute = notifications.pushForCurrentRoute({msg:'Will go away after route change'});
      expect(notifications.getCurrent().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.getCurrent().length).toEqual(1);
      expect(notifications.getCurrent()[0]).toBe(sticky);
    });
  });

  describe('notifications showing on next route change and expiring on a subsequent one', function () {

    it('should advertise a notification after a route change and remove on the subsequent route change', function () {
      notifications.pushSticky({msg:'Will stick around after route change'});
      notifications.pushForNextRoute({msg:'Will not be there till after route change'});
      expect(notifications.getCurrent().length).toEqual(1);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.getCurrent().length).toEqual(2);
      $scope.$emit('$routeChangeSuccess');
      expect(notifications.getCurrent().length).toEqual(1);
    });
  });
*/

});